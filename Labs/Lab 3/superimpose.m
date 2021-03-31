
function superimpose(backgroundInput,foregroundInput)

background = imread(backgroundInput);
foreground = imread(foregroundInput);

outputImage=imfuse(background,foreground);
figure(1), imshow(uint8(outputImage)),title('Fused image');

filepath = append('figures/', extractBefore(backgroundInput, '_'),'_',extractBefore(foregroundInput,'_'),'_fused.png');

imwrite(outputImage,filepath);