#!/usr/bin/env bash

set -u
set -e
set -x

# wait for elastic
while ! nc -z elasticsearch 9200
do
	echo "Waiting for elastic..."
	sleep 2
done
