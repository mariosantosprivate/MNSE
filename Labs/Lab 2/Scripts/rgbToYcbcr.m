function rgbToYcbcr = rgbToYcbcr(filename)

% i) Import a bitmap image and presents that image on the screen

im = imread(filename);

if size(im,3)~= 3
    im = cat(3,im,im,im);
end

figure(1);imshow(im);title('RGB image');

% Save image
filename = extractBefore(filename,".");
path = sprintf('figures/RGB/%s_RGB.png', filename);
imwrite(im,path)

% ii) Separate each RGB component in a different matrix and visualise each one on the screen

r = im(:,:,1);
g = im(:,:,2);
b = im(:,:,3);

figure(2);imshow(r); title('RGB image - R');
path = sprintf('figures/RGB/%s_R.png', filename);
imwrite(r,path)

figure(3);imshow(g); title('RGB image - G');
path = sprintf('figures/RGB/%s_G.png', filename);
imwrite(g,path)

figure(4);imshow(b); title('RGB image - B');
path = sprintf('figures/RGB/%s_B.png', filename);
imwrite(b,path)

% iii) Convert the RGB image to the YCbCr color space and present it on the screen; 

im_ycbcr = rgb2ycbcr(im);
figure(5);imshow(im_ycbcr);title('YCbCr image');
path = sprintf('figures/YCbCr/%s_YCbCr.png', filename);
imwrite(im_ycbcr,path)

% iv) Separate each YCbCr component in a different matrix and visualise each
% one on the screen

y = im_ycbcr(:,:,1);
cb = im_ycbcr(:,:,2);
cr = im_ycbcr(:,:,3);

figure(6);imshow(y); title('YCbCr image - Y');
path = sprintf('figures/YCbCr/%s_Y.png', filename);
imwrite(y,path)
figure(7);imshow(cb); title('YCbCr image - Cb');
path = sprintf('figures/YCbCr/%s_Cb.png', filename);
imwrite(cb,path)
figure(8);imshow(cr); title('YCbCr image - Cr');
path = sprintf('figures/YCbCr/%s_Cr.png', filename);
imwrite(cr,path)

rgbToYcbcr = 0; % Terminated successfully
end