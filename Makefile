build:
	docker build -t $(IMAGE_NAME) .
run:
	docker run  -d -p 3000:3000 --name voice2gptbot --rm voice2gptbot

