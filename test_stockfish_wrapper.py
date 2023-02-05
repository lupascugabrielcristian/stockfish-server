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

# Initial move
first_move = input("First move(e2e4): ")
stockfish.make_moves_from_current_position([first_move])
next_move = ""

# Game turns
while next_move != "exit":
    stockfish.make_moves_from_current_position([next_move])

    # A list of {'Move': 'f5d7', 'Centipawn': 713, 'Mate': None}. Mate is possibly 1
    for m in stockfish.get_top_moves(3):
        print(m['Move'])
    cp_move = input("Choose cp move: ")
    stockfish.make_moves_from_current_position([cp_move])

    print(stockfish.get_board_visual())
    next_move = input("Your next move(e2e4): ")
