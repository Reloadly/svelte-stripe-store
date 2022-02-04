<script>
import { Stretch } from 'svelte-loading-spinners'

let product = {
  productName: undefined,
  loading: false,
};

let results;

async function getGiftCards() {
  product.loading = true;
  try {
    const returnValue = await fetch("/giftcards");
    const response = await returnValue.json();
    results = response.data;

    product = {
      productName: results.productName,
      loading: false,
    };
  } catch (error) {
    console.error(error);
  }
}

</script>

<main>
	<div>
		<p>GET ALL THE CALL OF DUTY GIFT CARDS <br> YOU WANT HERE!</p>
    	<button class="search_button" on:click={getGiftCards}>SEARCH</button>
  	</div>
  	<div>
    	{#if product.loading === true}
	  		<Stretch size="50" color="#FFFFFF" unit="px"/>
		{:else if product.productName !== undefined }
		<div class="results">
    	  <img class="product_image" src="{results.logoUrls[0]}" alt="gift card images" width="200px"/>
          	  <p class="redeem_instructions">Redeem Instructions: {results.redeemInstruction.verbose}</p>
          	  <p class="price">Price: {results.fixedRecipientDenominations[0]} USD</p>
		  	  <form action="/create-checkout-session" method="POST">
		  		  <button class="search_button" type="submit">BUY NOW</button>
	  	  	  </form>
		</div>
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		font-family: myOutlineFont;
		font-size: 50px;
		letter-spacing: 3px;
		color: rgb(255, 255, 255);
	}

	.product_image {
		width: 40%;
		border-radius: 5px;
		margin: 20px 0 20px 0;
	}

	.search_button {
		background-color: rgba(255, 255, 255, 0.8);
		font-family: myRegularFont;
		cursor: pointer;
		border-radius: 5px;
		border: none;
		margin-bottom: 30px;
	}

	.search_button:hover {
		background-color:  rgba(179, 179, 179, 0.5);
		transition: all 0.7s ease;
	}

	.search_button:focus {
		background-color:  rgba(179, 179, 179);
		transition: all 0.1s ease;
	}

	.search_button:active {
		background-color: rgba(255, 255, 255, 0.8);
	}

	.results {
		cursor: default;
		background-color: rgba(255, 255, 255, 0.4);
		border: none;
		border-radius: 5px;
		padding: 20px 30px;
		margin: 30px 50px 30px 30px;
		font-size: 30px;
	}
</style>
