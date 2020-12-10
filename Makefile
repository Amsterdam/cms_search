.DEFAULT_GOAL := help

# PHONY prevents filenames being used as targets
.PHONY: help info rebuild status start stop restart build import_db shell

help: ## show this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## build Docker Compose images
	docker-compose build

start: ## start single Docker Compose service in detached mode. Run make update after starting the container to flush Drupal cache
	docker-compose up

stop: ## stop Docker Compose
	docker-compose down --remove-orphans

restart: stop start status ## restart Docker Compose

status: ## show Docker Compose process list
	docker-compose ps

rebuild: stop build start status ## stop running containers, build and start them

shell: ## execute command on container
	docker-compose exec cms_search sh
