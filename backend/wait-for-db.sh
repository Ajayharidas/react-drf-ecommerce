#!/usr/bin/env bash

# Check if at least 3 arguments are provided
if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <host> <port> <command>"
  exit 1
fi

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for ${host}:${port}..."

# Loop until the port on the specified host is available
until nc -z "$host" "$port"; do
  >&2 echo "Service at ${host}:${port} is unavailable - sleeping"
  sleep 1
done

>&2 echo "Service at ${host}:${port} is up - executing command"
exec $cmd
