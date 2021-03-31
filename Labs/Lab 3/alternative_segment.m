function alternative_segment (inputImg)

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

figure(3), imshow(g),title('Blue Channel');

figure(4), imshow(b),title('Green Channel');

% Calculate Blueness using formula Blueness = B - max(R,G)

blueness = b;
for i=1:height
    for j=1:width
        blueness(i,j) = b(i,j)-max(r(i,j),g(i,j));
    end
end

% Plot the histogram of the Blueness with the built-in function imhist 

figure(5),imhist(blueness),title('Blueness Histogram');
filepath = append('figures/',extractBefore(inputImg, '.'),'_blueness_channel_histogram.png');
saveas(gcf, filepath);

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
        if(blueness(i,j)<threshold)
           BWforeground(i,j)=255;
        end
    end
end

% Shows the black and white segmented image on the screen and creates in the disk a new file with that image. 

figure(6),imshow(BWforeground),title('Segmented Image');
filepath = append('figures/',extractBefore(inputImg, '.'),'_',int2str(threshold),'_alt_segmented.png');
imwrite(BWforeground,filepath);

close all;

