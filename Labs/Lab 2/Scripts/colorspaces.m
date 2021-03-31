function colorspaces = colorspaces(filename)

% i) Import a bitmap image and presents that image on the screen

im = imread(filename);

if size(im,3)~= 3
    im = cat(3,im,im,im);
end

figure(1);imshow(im);title('Original');

fprintf('\n Press any key view RGB components'); pause

% ii) Separate each RGB component in a different matrix and visualise each one on the screen

r = im(:,:,1);
g = im(:,:,2);
b = im(:,:,3);

figure(2);imshow(r); title('Original R Component');
figure(3);imshow(g); title('Original G Component');
figure(4);imshow(b); title('Original B Component');

fprintf('\n Press any key to view HSV image'); pause

% iii) Convert the RGB image to the HSV color space and present it on the screen; 

im_hsv = rgb2hsv(im);
figure(5);imshow(im_hsv);title('HSV image');

fprintf('\n Press any key to view separate HSV components'); pause

% iv) Separate each HSV component in a different amtrix and visualise each
% one on the screen

h = im_hsv(:,:,1);
s = im_hsv(:,:,2);
v = im_hsv(:,:,3);

figure(6);imshow(h); title('HSV Image H Component');
figure(7);imshow(s); title('HSV Image S Component');
figure(8);imshow(v); title('HSV Image V Component');

colorspaces = 0; % Terminated successfully
end