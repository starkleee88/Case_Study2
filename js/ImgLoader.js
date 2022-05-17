function ImgLoader(sources,onProgressChanged,onCompleted) {
	this.images = {};
	let loadedImages = 0;
	let totalImages = 0;
	
	if(onProgressChanged || onCompleted)
		for(let src in sources) {
			  totalImages++;
		}
	let self = this;
	for(let src in sources) {
		this.images[src] = new Image();
		this.images[src].onerror = function(){
		console.log("[Error] ImgLoader: "+src);
		};
		this.images[src].onload = function() {
		loadedImages++;
		if(onProgressChanged)
		{
			let percent = Math.floor((loadedImages/totalImages)*100);
			onProgressChanged(this,percent);
		}
		if(onCompleted && loadedImages >= totalImages)
			onCompleted(self.images);		
	  }
	  this.images[src].src = sources[src];
	}
}