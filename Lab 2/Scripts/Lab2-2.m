function[]=Lab21(ficheiroOriginal)

fprintf('\n Importar a imagem original para a variavel img \n');
img=imread(ficheiroOriginal);

%mostra a imagem no ecra
imshow(img);

[R,G,B] = imsplit(img);

allBlack = zeros(size(img,1,2),class(img));
justR = cat(3,R,allBlack,allBlack);
justG = cat(3,allBlack,G,allBlack);
justB = cat(3,allBlack,allBlack,B);

figure
montage({justR,justG,justB},'Size',[1 3], ...
    "BackgroundColor",'w',"BorderSize",10);
title('Color Representation of the Red, Green, and Blue Color Channels');

YCbCr = rgb2ycbcr(img);

title('Image in RGB Color Space');
    %Create a matrix of 0s, 512x512.
a = zeros(512,512);
    %Isolate Y. 
Y = YCbCr(:,:,1);
    %Isolate Cb. 
Cb = YCbCr(:,:,2);
    %Isolate Cr. 
Cr= YCbCr(:,:,3);
    %Create a YCbCr image with only the Y component.  
just_Y = cat(3, Y, a, a);
    %Create a YCbCr image with only the Cb component.  
just_Cb = cat(3, a, Cb, a);
    %Create a YCbCr image with only the Cr component.  
just_Cr = cat(3, a, a, Cr);
