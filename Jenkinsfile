pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/riddhimaBhanja/flightapp'
                bat "mvn -Dmaven.test.failure.ignore=true -DskipTests=true package"
            }
        }
        stage('Build docker images') {
            steps {
                echo 'Building the specified branch...'
                bat "docker build -f ./api-gateway/Dockerfile -t api-gateway ."
                bat "docker build -f ./auth-service/Dockerfile -t auth-service ."
                bat "docker build -f ./booking-service/Dockerfile -t booking-service ."
                bat "docker build -f ./flight-service/Dockerfile -t flight-service ."
                bat "docker build -f ./notification-service/Dockerfile -t notification-service ."
                bat "docker build -f ./eureka-server/Dockerfile -t eureka-server ."
            }
        }
        stage('Deploy images') {
            steps {
                echo 'Stopping and removing existing containers...'
                bat """
                    docker compose down || exit 0
                    docker stop mailhog booking-mongodb flight-mysql auth-mysql rabbitmq eureka-server flight-service auth-service booking-service notification-service api-gateway 2>nul || exit 0
                    docker rm mailhog booking-mongodb flight-mysql auth-mysql rabbitmq eureka-server flight-service auth-service booking-service notification-service api-gateway 2>nul || exit 0
                """
                echo 'Starting services with docker-compose...'
                bat "docker compose up -d"

                echo 'Waiting for services to become healthy...'
                sleep(time: 90, unit: 'SECONDS')

                echo 'Checking service status...'
                bat "docker ps -a"
            }
        }
    }
}
