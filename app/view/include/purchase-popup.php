<div id="popup">
	<div id="p-table">
		<div id="p-container">
			
			<div id="p-content">
				
				<div id="p-buttons">
					<div class="button cancel">X</div>
				</div>
				
				<h1>Purchase Credits</h1>
				<p>Fill out the information below to purchase more credits.<br><b>1 Credit = $5</b></p>
				
				<div id="credit-info">
					
					<div class="slide">
						
						<div class="half">
							<label>First Name</label>
							<input type="text" id="firstname" autocomplete="off" />
							
							<label>Last Name</label>
							<input type="text" id="lastname" autocomplete="off" />
						</div>
						
						<div class="half">
							<label>Credits</label>
							<div id="cred-amount">
								<?php for ($c=1; $c<11; $c++) : ?>
								<div class="amount"><?php echo $c; ?></div>
								<?php endfor; ?>
							</div>
							<div id="cred-toggle">
								<div class="up">+</div>
								<div class="down">-</div>
							</div>
						</div>
						
					</div>
					
					<div class="slide">
						
					</div>
					
				</div>
				
				<?php include ('keyboard.php'); ?>
				
			</div>
			
		</div>
	</div>
</div>