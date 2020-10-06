<div id="popup">
	<div id="p-table">
		<div id="p-container">
			
			<div id="p-content">
				
				<div id="p-buttons">
					<div class="button cancel">X</div>
				</div>
				
				<h1>Purchase Credits</h1>
				<p>Fill out the information below to purchase more credits.<br><b>1 Credit = $<?php echo credit_price(); ?></b></p>
				
				<div id="credit-info">
					
					<div id="slide-scroll">

						<div class="slide">

							<div class="half">
								<label>First Name</label>
								<input type="text" id="firstname" autocomplete="off" maxlength="20" />

								<label>Last Name</label>
								<input type="text" id="lastname" autocomplete="off" maxlength="20" />
							</div>

							<div class="half">
								<label>Credits</label>
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
							<h4>Swipe Card To Purchase Credits</h4>
							<div class="half">
								<img id="swipe-img" src="<?php echo $cfg['img_path']; ?>payment.png" />
							</div>
							<div class="half">
								<div id="fName"></div>
								<div id="lName"></div>
								<div id="cAmount"></div>
								<div id="cCharge"></div>
							</div>
						</div>
					
					</div>
					
				</div>
				
				<div id="purchase-buttons">
					<div class="button previous">Back</div>
					<div class="button proceed">Next</div>
				</div>
				
				<?php include ('keyboard.php'); ?>
				
			</div>
			
		</div>
	</div>
</div>