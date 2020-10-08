<?php

require $cfg['server_path'] . "/mpgClasses.php";

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
				$numOfPlayers = count($_POST['names']);
				
				$game_data = array(
					"game_type_id" 	=> $game_type_id,
					"status"		=> 'in_progress',
					"player_count"	=> $numOfPlayers,
					"created_at"	=> $time,
					"updated_at"	=> $time
				);
				$insert = $db->prepare("INSERT INTO games (game_type_id, status, player_count, created_at, updated_at) VALUES (:game_type_id, :status, :player_count, :created_at, :updated_at)");
				$insert->execute($game_data);
				$game_id = $db->lastInsertId();
				
				foreach ($_POST['names'] as $name) {
					
					$player_name = filter_var($name, FILTER_SANITIZE_STRING);
					$score = 0;

					if ($game_type_id == 2) {
						$score = 30;
					}
					
					$player_data = array(
						"game_id"		=> $game_id,
						"name"			=> $player_name,
						"score"			=> $score,
						"created_at"	=> $time,
						"updated_at"	=> $time
					);
					$insertPl = $db->prepare("INSERT INTO players (game_id, name, score, created_at, updated_at) VALUES (:game_id, :name, :score, :created_at, :updated_at)");
					$insertPl->execute($player_data);
					
				}
				
				if (payment_system() != 'free_play')
					decrementCredits($numOfPlayers);
				
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

		case 'process-payment':
			
			if (isset($_POST['card_number']) && isset($_POST['credits']) && isset($_POST['expiration_date'])) {
				
				$credits 			= filter_var($_POST['credits'], FILTER_SANITIZE_NUMBER_INT);
				$expiration_date 	= explode("-", filter_var($_POST['expiration_date'], FILTER_SANITIZE_STRING));
				$yy 				= substr($expiration_date[0], -2);
				$mm					= $expiration_date[1];
				
				/**************************** Request Variables *******************************/
				$store_id			= 'store5';
				$api_token			= 'yesguy';
				
				/************************* Transactional Variables ****************************/
				
				// Mandatory Values //
				$order_id			= 'ord-'.time();//.date("dmy-G:i:s");
				$amount				= $credits * credit_price();
				$pan				= filter_var($_POST['card_number'], FILTER_SANITIZE_NUMBER);
				$expiry_date		= $yy . $mm;
				$crypt				= '7';
				//////////////////////
				
				// Optional Values //
				$type				= 'purchase';
				$cust_id			= 'cust id';
				$dynamic_descriptor	= 'Leaderboard Golf Game |' ;
				$status_check 		= 'false';
				/////////////////////
				

				/*********************** Transactional Associative Array **********************/
				$txnArray=array('type'				=> $type,
								'order_id'			=> $order_id,
								'cust_id'			=> $cust_id,
								'amount'			=> $amount,
								'pan'				=> $pan,
								'expdate'			=> $expiry_date,
								'crypt_type'		=> $crypt,
								'dynamic_descriptor'=> $dynamic_descriptor
								//,'wallet_indicator' => '' //Refer to documentation for details
								//,'cm_id' => '8nAK8712sGaAkls56' //set only for usage with Offlinx - Unique max 50 alphanumeric characters transaction id generated by merchant
							);
				/**************************** Transaction Object *****************************/
				$mpgTxn = new mpgTransaction($txnArray);
				/******************* Credential on File **********************************/
				$cof = new CofInfo();
				$cof->setPaymentIndicator("U");
				$cof->setPaymentInformation("2");
				$cof->setIssuerId("168451306048014");
				$mpgTxn->setCofInfo($cof);
				/****************************** Request Object *******************************/
				$mpgRequest = new mpgRequest($mpgTxn);
				$mpgRequest->setProcCountryCode("CA"); //"US" for sending transaction to US environment
				$mpgRequest->setTestMode(true); //false or comment out this line for production transactions
				/***************************** HTTPS Post Object *****************************/
				/* Status Check Example
				$mpgHttpPost  =new mpgHttpsPostStatus($store_id,$api_token,$status_check,$mpgRequest);
				*/
				$mpgHttpPost = new mpgHttpsPost($store_id,$api_token,$mpgRequest);
				/******************************* Response ************************************/
				$mpgResponse=$mpgHttpPost->getMpgResponse();
				print("\nCardType = " . $mpgResponse->getCardType());
				print("\nTransAmount = " . $mpgResponse->getTransAmount());
				print("\nTxnNumber = " . $mpgResponse->getTxnNumber());
				print("\nReceiptId = " . $mpgResponse->getReceiptId());
				print("\nTransType = " . $mpgResponse->getTransType());
				print("\nReferenceNum = " . $mpgResponse->getReferenceNum());
				print("\nResponseCode = " . $mpgResponse->getResponseCode());
				print("\nISO = " . $mpgResponse->getISO());
				print("\nMessage = " . $mpgResponse->getMessage());
				print("\nIsVisaDebit = " . $mpgResponse->getIsVisaDebit());
				print("\nAuthCode = " . $mpgResponse->getAuthCode());
				print("\nComplete = " . $mpgResponse->getComplete());
				print("\nTransDate = " . $mpgResponse->getTransDate());
				print("\nTransTime = " . $mpgResponse->getTransTime());
				print("\nTicket = " . $mpgResponse->getTicket());
				print("\nTimedOut = " . $mpgResponse->getTimedOut());
				print("\nStatusCode = " . $mpgResponse->getStatusCode());
				print("\nStatusMessage = " . $mpgResponse->getStatusMessage());
				print("\nHostId = " . $mpgResponse->getHostId());
				print("\nIssuerId = " . $mpgResponse->getIssuerId());
				print_r(implode(" ", $mpgResponse));

				if ($mpgResponse->getResponseCode() != "null" && $mpgResponse->getResponseCode() < 50) {
					
					
					
				} else {
					var_dump("Some sort of Error");
					// Return error message
				}
				
				// $output = array('result' => 'success', 'names' => $_SESSION['players'], 'count' => count($_SESSION['players']));
				// exit(json_encode($output));
				
			} else {
				
				$output = array('result' => 'error', 'message' => 'Error processing payment');
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