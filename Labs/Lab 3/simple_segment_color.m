function simple_segment_color (inputImg)

% Imports a coloured image with a blue background and presents that image on the 
% screen; 

img = imread(inputImg);
if size(img,3) ~= 3
    img=cat(3,img,img,img);
end

figure(1), imshow(img),title('Original')

% get image dimensions: an RGB image has three planes
[height, width, planes] = size(img);

% Separates each RGB component in a different matrix, visualises each one on the 
% screen and writes to disk; 

if(planes==3)
    r = img(:, :, 1);         % red channel
    g = img(:, :, 2);         % green channel
    b = img(:, :, 3);          % blue channel
end

figure(2), imshow(r),title('Red Channel');
filepath = append('figures/',extractBefore(inputImg, '.'),'_red_channel.png');
imwrite(r,filepath);

figure(3), imshow(g),title('Blue Channel');
filepath = append('figures/',extractBefore(inputImg, '.'),'_blue_channel.png');
imwrite(g,filepath);

figure(4), imshow(b),title('Green Channel');
filepath = append('figures/',extractBefore(inputImg, '.'),'_green_channel.png');
imwrite(b,filepath);

% Generate the histogram of the Blue Channel with the built-in function imhist 

figure(5),imhist(b),title('Blue Channel Histogram');
filepath = append('figures/',extractBefore(inputImg, '.'),'_blue_channel_histogram.png');
saveas(gcf, filepath)

% Ask the user to input the threshold value

threshold = input('Input threshold:');

% Uses the matrix with the B component to identify the foreground objects (the jumping 
%man or the Christmas bulbs or the bird). Using a threshold, copy from the B matrix to a new matrix only 
%the pixel values that are below that threshold. 
%When doing that you may put those pixels with the value 255 and all the others with value 0 (you will create a black and white 
%picture). 

BWforeground = zeros(height,width);
for i = 1:height
    for j = 1:width
        if(b(i,j)<threshold)
           BWforeground(i,j)=255;
        end
    end
end

% Shows the black and white segmented image on the screen and creates in the disk a new file with that image. 

figure(6),imshow(BWforeground),title('B&W Segmented Image');
filepath = append('figures/',extractBefore(inputImg, '.'),'_',int2str(threshold),'_segmented.png');
imwrite(BWforeground,filepath);

% obtain the full color representation of the foreground objects
foregroundR=zeros(height, width);
foregroundG=zeros(height, width);
foregroundB=zeros(height, width);
for i=1:height
    for j=1:width
        if(BWforeground(i,j)==255)
            foregroundR(i,j)=r(i,j);
            foregroundG(i,j)=g(i,j);
            foregroundB(i,j)=b(i,j);
        end
    end
end
foregroundRGB=cat(3,uint8(foregroundR),uint8(foregroundG),uint8(foregroundB));

%
figure(7),imshow(foregroundRGB),title('Coloured Foreground');
filepath = append('figures/',extractBefore(inputImg, '.'),'_',int2str(threshold),'_segmented_colored.png');
imwrite(foregroundRGB,filepath);

close all;

%a) Interpret the results and comment the results taking into consideration that you have used only the blue channel. 
%b) Could there be low blue value in zones of the background? 
%c) Could there be high blue values in some parts of the foreground objects? 
%d)Is it always true that a pixel with a high value in the B component is always blue?

