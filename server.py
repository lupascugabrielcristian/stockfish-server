import os
from flask import Flask
from gevent.pywsgi import WSGIServer
from stockfish import Stockfish


stockfish = Stockfish(path="/home/alex/apps/stockfish/stockfish_15.1_linux_x64/stockfish-ubuntu-20.04-x86-64", depth=2, parameters={
    "Debug Log File": "",
    "Contempt": 0,
    "Min Split Depth": 0,
    "Threads": 2, # More threads will make the engine stronger, but should be kept at less than the number of logical processors on your computer.
    "Ponder": "false",
    "Hash": 16, # Default size is 16 MB. It's recommended that you increase this value, but keep it as some power of 2. E.g., if you're fine using 2 GB of RAM, set Hash to 2048 (11th power of 2).
    "MultiPV": 1,
    "Skill Level": 2,
    "Move Overhead": 10,
    "Minimum Thinking Time": 10,
    "Slow Mover": 100,
    "UCI_Chess960": "false",
    "UCI_LimitStrength": "false",
    "UCI_Elo": 1350
})

app = Flask(__name__)

@app.route('/stockfishserver/newgame/')
def new_game():
    """
    To send to engine the command to reset the board position
    """
    pass

@app.route('/stockfishserver/mymove/<string:move>/')
def send_my_move(move: str):
    """
    Sends the current move for the player. It will send back 3 optional moves for the engine. The player will choose with move to make

    Return
        cp_options: List of string representing move options for the engine
        move_ok: If the move is not possible this will be false
    """
    if not stockfish.is_move_correct(move):
        return { 'cp_options': [], 'move_ok': 'False' }

    stockfish.make_moves_from_current_position([move])
    # Get cp move options
    # A list of {'Move': 'f5d7', 'Centipawn': 713, 'Mate': None}. Mate is possibly 1
    options = []
    for m in stockfish.get_top_moves(3):
        options.append(m['Move'])
    return { 'cp_options': options, 'move_ok': 'True' }

@app.route('/stockfishserver/cpmove/<string:move>/')
def send_cp_move(move: str):
    """
    Sends the next engine move. Will respond with "ok" if the move was sucessfully made, "mate"/"draw"/"check" for corresponding options
    """
    stockfish.make_moves_from_current_position([move])
    return { 'result': 'ok' }


if __name__== '__main__':
    # Debug/Development
    # app.run(debug=True, host="0.0.0.0", port="5001")

    # Production
    print("Started on 5001")
    http_server = WSGIServer(('', 5001), app)
    http_server.serve_forever()
