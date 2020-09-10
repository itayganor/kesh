#!/bin/bash

docker run --rm --init --name npm-site -p 3002:8080 -d danielmitrov/npm-site

