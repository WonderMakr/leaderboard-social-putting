<?php

if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['command']) ) {

	switch ($_POST['command']) {
			
		case 'get-credits':

			$output = array('result' => 'success', 'credits' => numOfCredits());
			exit(json_encode($output));

		break;
			
		case 'start-game':

			if (isset($_POST['names']) && isset($_POST['game'])) {
				
				$game = filter_var($_POST['game'], FILTER_SANITIZE_STRING);
				$game_type_id = getGameTypeID($game);
				$time = time();
				
				$game_data = array(
					"game_type_id" 	=> $game_type_id,
					"status"		=> 'in_progress',
					"player_count"	=> count($_POST['names']),
					"created_at"	=> $time,
					"updated_at"	=> $time
				);
				$insert = $db->prepare("INSERT INTO games (game_type_id, status, player_count, created_at, updated_at) VALUES (:game_type_id, :status, :player_count, :created_at, :updated_at)");
				$insert->execute($game_data);
				$game_id = $db->lastInsertId();
				
				foreach ($_POST['names'] as $name) {
					
					$player_name = filter_var($name, FILTER_SANITIZE_STRING);
					
					$player_data = array(
						"game_id"		=> $game_id,
						"name"			=> $player_name,
						"created_at"	=> $time,
						"updated_at"	=> $time
					);
					$insertPl = $db->prepare("INSERT INTO players (game_id, name, created_at, updated_at) VALUES (:game_id, :name, :created_at, :updated_at)");
					$insertPl->execute($player_data);
					
				}
				
				$output = array('result' => 'success', 'message' => "Game has been started");
				exit(json_encode($output));

			} else {
				
				$output = array('result' => 'error', 'message' => 'Invalid post values');
				exit (json_encode($output));
			}
			
		break;
			
		case 'end-clear-game':
			
			if (isset($_POST['game_id'])) {
				
				$game_id = filter_var($_POST['game_id'], FILTER_SANITIZE_STRING);
				
				// Check status
				$sql = "SELECT status FROM games WHERE id = :id";
				$select = $db->prepare($sql);
				$select->execute(array("id" => $game_id));
				$game_status = $select->fetch(PDO::FETCH_COLUMN);
				
				if ($game_status == 'completed') {
					$output = array('result' => 'success', 'message' => "Game is already completed");
					exit(json_encode($output));
				}
				
				$game_data = array(
					"game_id" 		=> $game_id,
					"status"		=> "incomplete",
					"updated_at"	=> time()
				);
				$update = $db->prepare("UPDATE `games` SET `status` = :status, `updated_at` = :updated_at WHERE `games`.`id` = :game_id");
				$update->execute($game_data);
				
				$output = array('result' => 'success', 'message' => "Game has been marked as incomplete");
				exit(json_encode($output));

			} else {
				
				$output = array('result' => 'error', 'message' => 'Invalid post values');
				exit (json_encode($output));
			}
			
		break;
			
		case 'complete-game':
			
			if (isset($_POST['game_id'])) {
				
				$game_id = filter_var($_POST['game_id'], FILTER_SANITIZE_STRING);
				
				$game_data = array(
					"game_id" 		=> $game_id,
					"status"		=> "completed",
					"updated_at"	=> time()
				);
				$update = $db->prepare("UPDATE `games` SET `status` = :status, `updated_at` = :updated_at WHERE `games`.`id` = :game_id");
				$update->execute($game_data);
				
				$output = array('result' => 'success', 'message' => "Game has been marked as completed");
				exit(json_encode($output));

			} else {
				
				$output = array('result' => 'error', 'message' => 'Invalid post values');
				exit (json_encode($output));
			}
			
		break;
			
		default :
			$output = array('result' => 'error', 'message' => 'Invalid command');
			exit (json_encode($output));
		break;
			
	}

}

?>