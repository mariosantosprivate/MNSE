function rgbToHsv = rgbToHsv(filename)

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
fprintf('\n Press any key view RGB components'); pause

fprintf('\n Press any key view RGB components'); pause

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

fprintf('\n Press any key to view HSV image'); pause

% iii) Convert the RGB image to the HSV color space and present it on the screen; 

im_hsv = rgb2hsv(im);
figure(5);imshow(im_hsv);title('HSV image');
path = sprintf('figures/HSV/%s_HSV.png', filename);
imwrite(im_hsv,path)

fprintf('\n Press any key to view separate HSV components'); pause

% iv) Separate each HSV component in a different matrix and visualise each
% one on the screen

h = im_hsv(:,:,1);
s = im_hsv(:,:,2);
v = im_hsv(:,:,3);

figure(6);imshow(h); title('HSV image - H');
path = sprintf('figures/HSV/%s_H.png', filename);
imwrite(h,path)
figure(7);imshow(s); title('HSV image - S');
path = sprintf('figures/HSV/%s_S.png', filename);
imwrite(s,path)
figure(8);imshow(v); title('HSV image - V');
path = sprintf('figures/HSV/%s_V.png', filename);
imwrite(v,path)

rgbToHsv = 0; % Terminated successfully
end