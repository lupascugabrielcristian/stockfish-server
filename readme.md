# Scope
The use of this is to play chess on a board vs stockfish chess engine without a GUI. My idea was to play on my phone just for convenience.

## Structure
A small flask web server will send and receive moves and commands to the Stockfish engine. If is the case nginx proxy server will be put in place before the web server. This should run on local wifi network but also on a dedicated server out on the internet. In that case is recomended to use the proxy with SSL on. This server is supossed to work together with any kind of a small interface where one can type his move and the computer move

## Setup
pyenv install -v 3.8.0
pyenv virtualenv 3.8.0 stockfish
pyenv activate stockfish
pip install --upgrade pip
pip install stockfish

## Testing
test_stockfish_wrapper.py is standalone python script that can take turns to play a game of chess against the engine

## Running
### Server
pyenv activate stockfish
python server.py
### Client
To nginx configuration /etc/nginx/nginx.conf should add:
```
server {
    listen 8080;
    root /home/alex/projects/python/stockfish/public_html;
    
    location /stockfishserver {
   	 proxy_pass http://localhost:5001;
    }

}
```
server nginx start
go to http://localhost:8080
