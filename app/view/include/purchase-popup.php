<div id="popup">
	<div id="p-table">
		<div id="p-container">
			
			<div id="p-content">
				
				<div id="p-buttons">
					<div class="button cancel">X</div>
				</div>
				
				<h1><?php echo $lang_purchase; ?></h1>
				<p class="fillout"><?php echo $lang_fillout_info; ?><br><b><?php echo $lang_one_ply_is_one_cred; ?><br><?php echo $lang_one_cred_is . credit_price(); if (monerisState() != 'live') echo ' (Test Mode)'; ?></b></p>
				
				<div id="credit-info">
					
					<div id="slide-scroll">
					
						<div class="slide">

							<div class="half">
								<label><?php echo $lang_firstname; ?></label>
								<input type="text" id="firstname" autocomplete="off" maxlength="20" />

								<label><?php echo $lang_lastname; ?></label>
								<input type="text" id="lastname" autocomplete="off" maxlength="20" />
							</div>

							<div class="half">
								<label><?php echo $lang_credits; ?></label>
								<div id="cred-amount">
									<div id="cred-amount-scroll">
										<?php for ($c=1; $c<=8; $c++) : ?>
										<div class="amount<?php if ($c==1) echo " current"; ?>"><?php echo $c; ?></div>
										<?php endfor; ?>
									</div>
								</div>
								<div id="cred-toggle">
									<div class="up">+</div>
									<div class="down">-</div>
								</div>
							</div>
							
						</div>
						
						<div class="slide second">
							<h4><?php echo $lang_swipe_to_purchase; ?></h4>
							<div id="processing">
								<div id="ldr"><img src="<?php echo $cfg['img_path']; ?>loader.gif" /></div>
								<p><?php echo $lang_processing; ?></p>
								<div id="err"></div>
							</div>
							<div class="half">
								<img id="swipe-img" src="<?php echo $cfg['img_path']; ?>swipe-card.png" />
							</div>
							<div class="half">
								<div id="fName"></div>
								<div id="lName"></div>
								<div id="cAmount"></div>
								<div id="cCharge"></div>
							</div>
						</div>
						
						<div class="slide third">
						
							<h4><?php echo $lang_thanks_for_purch; ?></h4>
							
							<p id="succ"></p>
							<p><?php echo $lang_enjoy_the_game; ?></p>
							
						</div>
						
					</div>
					
				</div>
				
				<div id="purchase-buttons">
					<div class="button previous"><?php echo $lang_back; ?></div>
					<div class="button proceed"><?php echo $lang_next; ?></div>
					<div class="button close"><?php echo $lang_close; ?></div>
				</div>
				
				<?php include ('keyboard.php'); ?>
				
			</div>
			
		</div>
	</div>
</div>