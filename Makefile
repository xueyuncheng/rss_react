FRONTEND_IMAGE_NAME := rsshub-frontend:v1.0.0
IMAGE_NAME := rsshub-backend:v1.0.0

build-frontend-image:
	cd web && docker build -t $(FRONTEND_IMAGE_NAME) .

build-image:
	docker build -t $(IMAGE_NAME) -f build/backend/Dockerfile . 
