package com.flightapp.notification.messaging;

import com.flightapp.notification.config.RabbitMQConfig;
import com.flightapp.notification.dto.EmailNotification;
import com.flightapp.notification.entity.NotificationLog;
import com.flightapp.notification.repository.NotificationLogRepository;
import com.flightapp.notification.service.EmailService;
import com.flightapp.notification.service.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class BookingConfirmationListener {

    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final NotificationLogRepository notificationLogRepository;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE)
    public void handleBookingConfirmation(EmailNotification notification) {
        log.info("Received booking confirmation message for PNR: {}", notification.getPnr());

        try {
            // Parse booking data from the body (or use the notification fields directly)
            Map<String, Object> templateData = new HashMap<>();
            templateData.put("customerName", notification.getPassengerName());
            templateData.put("pnr", notification.getPnr());
            templateData.put("flightNumber", notification.getFlightNumber());

            // Extract additional details from body if needed
            String body = notification.getBody();
            extractBookingDetails(body, templateData);

            // Process the template
            String htmlBody = emailTemplateService.processTemplate(
                    "booking-confirmation",
                    templateData
            );

            // Create notification log
            NotificationLog notificationLog = NotificationLog.builder()
                    .customerId(notification.getPnr())
                    .customerName(notification.getPassengerName())
                    .customerEmail(notification.getTo())
                    .templateName("booking-confirmation")
                    .subject(notification.getSubject())
                    .body(htmlBody)
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();

            // Save the log
            notificationLogRepository.save(notificationLog).block();

            // Send the email
            emailService.sendHtmlEmail(
                    notification.getTo(),
                    notification.getSubject(),
                    htmlBody
            ).subscribe(success -> {
                if (success) {
                    notificationLog.setStatus("SENT");
                    notificationLog.setSentAt(LocalDateTime.now());
                    log.info("Email sent successfully to {} for PNR: {}",
                            notification.getTo(), notification.getPnr());
                } else {
                    notificationLog.setStatus("FAILED");
                    notificationLog.setErrorMessage("Failed to send email");
                    log.error("Failed to send email for PNR: {}", notification.getPnr());
                }
                notificationLogRepository.save(notificationLog).subscribe();
            });

        } catch (Exception e) {
            log.error("Error processing booking confirmation for PNR {}: {}",
                    notification.getPnr(), e.getMessage(), e);
        }
    }

    private void extractBookingDetails(String body, Map<String, Object> templateData) {
        try {
            // Extract details from the text body
            String[] lines = body.split("\n");
            for (String line : lines) {
                if (line.contains("Number of Seats:")) {
                    String seats = line.split(":")[1].trim();
                    templateData.put("numberOfSeats", seats);
                } else if (line.contains("Total Amount:")) {
                    String amount = line.split(":")[1].trim().replace("Rs. ", "");
                    templateData.put("totalAmount", amount);
                } else if (line.contains("Booking Date:")) {
                    String date = line.split(":", 2)[1].trim();
                    templateData.put("bookingDate", date);
                }
            }
        } catch (Exception e) {
            log.warn("Could not extract all booking details from body: {}", e.getMessage());
            // Set default values if extraction fails
            templateData.putIfAbsent("numberOfSeats", "N/A");
            templateData.putIfAbsent("totalAmount", "N/A");
            templateData.putIfAbsent("bookingDate", LocalDateTime.now().toString());
        }
    }
}
