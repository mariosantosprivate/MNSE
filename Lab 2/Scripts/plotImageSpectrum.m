function plotImageSpectrum(img)
psd = 10*log10(abs(fftshift(fft2(img))).^2 );
figure();
mesh(psd);