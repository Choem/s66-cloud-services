kubectl port-forward $(kubectl get pods | grep -o "^mysql[a-z0-9\-]\+") 3306 &
PORT_FORWARD_PID=$!

./node_modules/.bin/ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate $@

kill $PORT_FORWARD_PID