## Getting Started

## White docker

Build docker image

```base
docker build -t fa-image .
```

Make container

```base
docker run --name fa-container -v  Your/path/to/the/project:/usr/src/app -p 3000:3000 fa-image
```

To stop the container

```base
docker stop fa-container
```

To start the container

```base
docker start fa-container
```

After starting container you can access the app at http://localhost:3000

## Or you can run the app locally

Install all the dependencies:

```bash
npm install
```

First, run the development server:

```bash
npm run dev
```
