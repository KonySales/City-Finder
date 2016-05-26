
function onMasterScroll() {
	var scrollOffset = frmDetails.flexScrollContent.contentOffsetMeasured;
	var scrollOffsetY = scrollOffset.y;
  	
	if(scrollOffsetY < 0){
		frmDetails.img.height = (45 - (scrollOffsetY*0.2))+ "%";
		frmDetails.img.width = (100 - (scrollOffsetY*0.2))+ "%";
      	
		frmDetails.img.top="0%";
	}
	frmDetails.forceLayout();
	frmDetails.flexScrollContent.forceLayout();
}

function onClickSearchBox() {
    if (frmMap.flexSearchOptions.isVisible === false) {
        frmMap.flexSearchOptions.setVisibility(true);
    } else {
        frmMap.flexSearchOptions.setVisibility(false);
    }
}
