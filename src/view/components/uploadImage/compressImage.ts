export const compressImage = (
	file: File,
	maxSizeKB: number,
	setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<File> => {
	return new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.readAsDataURL(file);
  
	  reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result as string;
  
			img.onload = () => {
		  const canvas = document.createElement("canvas");
		  const ctx = canvas.getContext("2d");
		  if (!ctx) {
					return reject(new Error("Could not get canvas context"));
		  }
  
		  let width = img.width;
		  let height = img.height;
		  const MAX_TRIES = 10;
		  let quality = 0.8;
		  let tries = 0;
  
		  const resize = () => {
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);
  
					// Track progress during compression
					canvas.toBlob(
			  (blob) => {
							if (blob) {
				  const sizeKB = blob.size / 1024;
				  const progress = Math.min((1 - quality) * 100, 100); 
				  setProgress(progress);
  
				  if (sizeKB <= maxSizeKB) {
									setProgress(100);
									resolve(new File([blob], file.name, { type: file.type }));
				  } else if (tries < MAX_TRIES) {
									quality -= 0.1;
									width *= 0.9;
									height *= 0.9;
									tries++;
									resize();
				  } else {
									reject(new Error("Unable to compress image below max size"));
				  }
							}
			  },
			  file.type,
			  quality
					);
		  };
  
		  resize();
			};
	  };
  
	  reader.onerror = (error) =>
			reject(
		  new Error(
					`FileReader error: ${
			  error instanceof Error ? error.message : JSON.stringify(error)
					}`
		  )
			);
	});
};
