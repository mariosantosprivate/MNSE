function rgb2yuv(imagemEntrada)

I=imread(imagemEntrada);

%I=im2double(I);

if size(I,3)~= 3
    I = cat(3,I,I,I);
end

figure(1);imshow(I);title('RGB image');

% Save image
filename = extractBefore(imagemEntrada,".");
path = sprintf('figures/RGB/%s_RGB.png', filename);
imwrite(I,path)

R=I(:,:,1);
G=I(:,:,2);
B=I(:,:,3);


figure(2);imshow(R);title('RGB image - R');
path = sprintf('figures/RGB/%s_RGB_R.png', filename);
imwrite(R,path)
figure(3);imshow(G);title('RGB image - G');
path = sprintf('figures/RGB/%s_RGB_G.png', filename);
imwrite(G,path)
figure(4);imshow(R);title('RGB image - B');
path = sprintf('figures/RGB/%s_RGB_B.png', filename);
imwrite(B,path)
%figure(1); 
%subplot(2,3,2),imshow(I); title('imagem original');
%subplot(2,3,4),imshow(R); title('componente R');
%subplot(2,3,5),imshow(G); title('componente G');
%subplot(2,3,6),imshow(B); title('componente B');

%conversao para YUV

Y = 0.299 * R + 0.587 * G + 0.114 * B;
U = .5-0.14713 * R - 0.28886 * G + 0.436 * B;
V = .5+0.615 * R - 0.51499 * G - 0.10001 * B;

YUV = cat(3,Y,U,V);

figure(5);imshow(YUV);title('YUV image');
path = sprintf('figures/YUV/%s_YUV.png', filename);
imwrite(YUV,path)

figure(6);imshow(Y);title('YUV image - Y');
path = sprintf('figures/YUV/%s_Y.png', filename);
imwrite(Y,path)
figure(7);imshow(U);title('YUV image - U');
path = sprintf('figures/YUV/%s_U.png', filename);
imwrite(U,path)
figure(8);imshow(V);title('YUV image - V');
path = sprintf('figures/YUV/%s_V.png', filename);
imwrite(V,path)
%figure(2); 
%subplot(2,3,2),imshow(YUV); title('imagem YUV');
%subplot(2,3,4),imshow(Y); title('componente Y');
%subplot(2,3,5),imshow(U); title('componente U');
%subplot(2,3,6),imshow(V); title('componente V');

%converter de novo para RGB

R = Y + 1.139834576 * (V-0.5);
G = Y -.3946460533 * (U-0.5) -.58060 * (V-0.5);
B = Y + 2.032111938 * (U-0.5);

RGB = cat(3,R,G,B);

figure(3),imshow(RGB), title(' imagem RGB recuperada');