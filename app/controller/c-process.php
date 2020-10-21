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
			
			if (isset($_POST['card_number']) && isset($_POST['credits']) && isset($_POST['expiration_date']) 
				&& isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['name_on_card'])) {
				
				$credits 			= filter_var($_POST['credits'], FILTER_SANITIZE_NUMBER_INT);
				$firstname			= filter_var($_POST['firstname'], FILTER_SANITIZE_STRING);
				$lastname			= filter_var($_POST['lastname'], FILTER_SANITIZE_STRING);
				$name_on_card		= filter_var($_POST['name_on_card'], FILTER_SANITIZE_STRING);
				$clean_name			= strtolower(preg_replace('#[ -]+#', '-', $firstname . ' ' . $lastname));
				$expiration_date 	= explode("-", filter_var($_POST['expiration_date'], FILTER_SANITIZE_STRING));
				$yy 				= substr($expiration_date[0], -2);
				$mm					= $expiration_date[1];
				$time 				= time();
				
				$moneris_state = monerisState();
				/**************************** Request Variables *******************************/
				if ($moneris_state == 'live') {
					// LIVE VARIABLES
					$store_id			= 'monmpg4964';
					$api_token			= 'zRTkmvM3P1OhmjoYwSPY';
				} else {
					// TESTING
					$store_id			= 'store5';
					$api_token			= 'yesguy';
				}
				/************************* Transactional Variables ****************************/
				
				// Mandatory Values //
				$order_id			= 'ord-'.$time;//.date("dmy-G:i:s");
				$amount				= $credits * credit_price();
				$pan				= filter_var($_POST['card_number'], FILTER_SANITIZE_NUMBER_INT);//'4242424242424242';
				$expiry_date		= $yy . $mm;
				$crypt				= '7';
				//////////////////////
				
				// Optional Values //
				$type				= 'purchase';
				$cust_id			= 'CID-' . $clean_name . '-' . $time;
				$dynamic_descriptor	= 'Leaderboard: ' . $credits . ' Crd';//'Sale: $' . $amount . '|' . $credits . ' Crd' ;
				$status_check 		= 'false';
				/////////////////////
				

				/*********************** Transactional Associative Array **********************/
				$txnArray=array('type'				=> $type,
								'order_id'			=> $order_id,
								'cust_id'			=> $cust_id,
								'amount'			=> $amount.'.00',
								'pan'				=> $pan,
								'expdate'			=> $expiry_date,
								'crypt_type'		=> $crypt,
								'dynamic_descriptor'=> $dynamic_descriptor
								//,'wallet_indicator' => '' //Refer to documentation for details
								//,'cm_id' => '8nAK8712sGaAkls56' //set only for usage with Offlinx - Unique max 50 alphanumeric characters transaction id generated by merchant
							);
				//var_dump($txnArray);exit();
				/**************************** Transaction Object *****************************/
				$mpgTxn = new mpgTransaction($txnArray);
				/******************* Credential on File **********************************/
				/*
				$cof = new CofInfo();
				$cof->setPaymentIndicator("U");
				$cof->setPaymentInformation("2");
				$cof->setIssuerId("30201049360");
				$mpgTxn->setCofInfo($cof);
				*/
				/****************************** Request Object *******************************/
				$mpgRequest = new mpgRequest($mpgTxn);
				$mpgRequest->setProcCountryCode("CA"); //"US" for sending transaction to US environment
				if ($moneris_state != 'live')
					$mpgRequest->setTestMode(true); //false or comment out this line for production transactions
				/***************************** HTTPS Post Object *****************************/
				/* Status Check Example
				$mpgHttpPost  =new mpgHttpsPostStatus($store_id,$api_token,$status_check,$mpgRequest);
				*/
				$mpgHttpPost = new mpgHttpsPost($store_id,$api_token,$mpgRequest);
				/******************************* Response ************************************/
				$mpgResponse=$mpgHttpPost->getMpgResponse();
				/*
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
				print("\n");
				//print_r(implode(" ", $mpgResponse));*/
				
				$msg_response = array(
				
					"CardType" => $mpgResponse->getCardType(),
					"TransAmount" => $mpgResponse->getTransAmount(),
					"TxnNumber" => $mpgResponse->getTxnNumber(),
					"ReceiptId" => $mpgResponse->getReceiptId(),
					"TransType" => $mpgResponse->getTransType(),
					"ReferenceNum" => $mpgResponse->getReferenceNum(),
					"ResponseCode" => $mpgResponse->getResponseCode(),
					"ISO" => $mpgResponse->getISO(),
					"Message" => $mpgResponse->getMessage(),
					"IsVisaDebit" => $mpgResponse->getIsVisaDebit(),
					"AuthCode" => $mpgResponse->getAuthCode(),
					"Complete" => $mpgResponse->getComplete(),
					"TransDate" => $mpgResponse->getTransDate(),
					"TransTime" => $mpgResponse->getTransTime(),
					"Ticket" => $mpgResponse->getTicket(),
					"TimedOut" => $mpgResponse->getTimedOut(),
					"StatusCode" => $mpgResponse->getStatusCode(),
					"StatusMessage" => $mpgResponse->getStatusMessage(),
					"HostId" => $mpgResponse->getHostId(),
					"IssuerId" => $mpgResponse->getIssuerId()
				
				);
			
				if ($mpgResponse->getResponseCode() != "null" && $mpgResponse->getResponseCode() < 50) {
					
					incrementCredits($credits);
					
					$trans_data = array(
						"firstname" 	=> $firstname,
						"lastname"		=> $lastname,
						"name_on_card"	=> $name_on_card,
						"receipt_id" 	=> $mpgResponse->getReceiptId(),
						"reference_num"	=> $mpgResponse->getReferenceNum(),
						"credits"		=> $credits,
						"amount"	 	=> $amount,
						"moneris_state" => $moneris_state,
						"datetime"		=> $time
					);
					$insert = $db->prepare("INSERT INTO `transactions` (`firstname`, `lastname`, `name_on_card`, `receipt_id`, `reference_num`, `credits`, `amount`, `moneris_state`, `datetime`) VALUES (:firstname, :lastname, :name_on_card, :receipt_id, :reference_num, :credits, :amount, :moneris_state, :datetime)");
					$insert->execute($trans_data);
					
					$output = array('result' => 'success', 'mpgMessage' => $mpgResponse->getMessage(), 
									'new_credits' => $lang_aval_cred . ': ' . numOfCredits() . '<span id="error"><br>&nbsp;</span>',
									'message' => "$credits credit(s) have been added", "mpgResponse" => $msg_response);
					exit(json_encode($output));
					
				} else {
					
					$output = array('result' => 'Error', 'message' => 'Error: '.$mpgResponse->getMessage(), 'mpgMessage' => $mpgResponse->getMessage(), "mpgResponse" => $msg_response);
					
					if (strpos($mpgResponse->getMessage(), 'Global Error Receipt') !== false)
						$output['message'] = 'Error: Unable to connect to Moneris';
						
					else if (strpos($mpgResponse->getMessage(), 'DECLINED') !== false)
						$output['message'] = 'Transaction Declined. Please try again';
							 
					exit(json_encode($output));
				}
				
			} else {
				
				$output = array('result' => 'error', 'message' => 'Error processing payment');
				exit (json_encode($output));
			}
			
		break;
			
		case 'manager-override':
			
			if (isset($_POST['card_number']) && isset($_POST['credits'])) {
				
				$credits 		= filter_var($_POST['credits'], FILTER_SANITIZE_NUMBER_INT);
				$card_number	= filter_var($_POST['card_number'], FILTER_SANITIZE_NUMBER_INT);
				$amount			= $credits * credit_price();
				$moneris_state 	= monerisState();
				
				$managers_id = strstr(substr($card_number, -11), '01');
				
				$manager_info = isManager($managers_id);
				
				if ($manager_info != -1) {
					
					incrementCredits($credits);
					
					$trans_data = array(
						"firstname" 	=> $manager_info['firstname'],
						"lastname"		=> $manager_info['lastname'],
						"name_on_card"	=> "Override",
						"receipt_id" 	=> $manager_info['id'],
						"reference_num"	=> "None",
						"credits"		=> $credits,
						"amount"	 	=> $amount,
						"moneris_state" => $moneris_state,
						"datetime"		=> time()
					);
					$insert = $db->prepare("INSERT INTO `transactions` (`firstname`, `lastname`, `name_on_card`, `receipt_id`, `reference_num`, `credits`, `amount`, `moneris_state`, `datetime`) VALUES (:firstname, :lastname, :name_on_card, :receipt_id, :reference_num, :credits, :amount, :moneris_state, :datetime)");
					$insert->execute($trans_data);
					
					$output = array('result' => 'success', 'new_credits' => $lang_aval_cred . ': ' . numOfCredits() . '<span id="error"><br>&nbsp;</span>', 
									'message' => "$credits credit(s) have been added", 'name' => $manager_info['firstname'] . ' ' . $manager_info['lastname']);
					
				} else {
					$output = array('result' => 'Error', 'card' => $managers_id, 'message' => 'Invalid Managers ID. Please try again');
				}
				
				exit(json_encode($output));
			
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