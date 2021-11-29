kafka-up:
	docker run -d -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=127.0.0.1 --name kafka-local --env ADVERTISED_PORT=9092 spotify/kafka
kafka-down:
	docker stop kafka-local && docker rm kafka-local