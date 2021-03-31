function[]=Lab22(ficheiroOriginal)

fprintf('\n Importar a imagem original para a variavel img \n');
img=imread(ficheiroOriginal);

%mostra a imagem no ecra
imshow(img);

[R,G,B] = imsplit(img);

fprintf('\n imagem RGB \n');

figure(1); 
subplot(2,3,2),imshow(img); title('imagem original');
subplot(2,3,4),imshow(R); title('componente R');
subplot(2,3,5),imshow(G); title('componente G');
subplot(2,3,6),imshow(B); title('componente B');

imgHSV = rgb2hsv(img);

H = imgHSV(:,:,1);
S = imgHSV(:,:,2);
V = imgHSV(:,:,3);

maskH = rgbImage .* repmat(uint8(H),[1 1 3]);
subplot(3, 2, 6);
imshow(maskH);
title('MaskH Image', 'FontSize', fontSize);

maskS = rgbImage .* repmat(uint8(S),[1 1 3]);
subplot(3, 2, 6);
imshow(maskS);
title('MaskS Image', 'FontSize', fontSize);

maskV = rgbImage .* repmat(uint8(V),[1 1 3]);
subplot(3, 2, 6);
imshow(maskV);
title('MaskV Image', 'FontSize', fontSize);
