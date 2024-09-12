if [[ -z $(docker ps -a | grep mongo) ]]; then
    docker run -d --name mongo -p "27017:27017" mongo
else
    docker start mongo
fi


