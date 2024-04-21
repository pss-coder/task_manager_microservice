build:
	cd server && $(MAKE) build
	cd frontend-client && $(MAKE) build

run:
	docker-compose up

stop:
	docker-compose down