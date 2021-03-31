function[]=amostragemInterp_comFiltro(ficheiroOriginal,ficheiroInterpolado,k)
% Usage : amostragemInterp_comFiltro('ficheiroOriginal','ficheiroInterpolado',k)

fprintf('\n Importar o sinal original para a variavel y \n');
[y,fs]=audioread(ficheiroOriginal);

%tornar a sequencia de amostras multipla de k
orig_length=length(y); N=floor(orig_length/k)*k; y = y(1:N);
%mostrar a frequencia de amostragem e numero de amostras multiplo de k
fprintf('\nfrequencia de amostragem = %g ; numero de amostras = %g\n',fs,N)
fprintf('Numero original de amostras no sinal de entrada = %g\n\n',orig_length);
%disp([fs,N]);

% tocar e mostrar a sequencia
sound(y,fs);
figure(1);
subplot(1,2,1),bar(y(2000:2060),0.02);axis tight;title('Forma de onda original');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(y, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequencia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal original');

%subplot(1,2,2),psd(y,256,fs);axis([0,fs/2,- 60,0]);ylabel('');xlabel('');
%title('Espectro do sinal original');

fprintf('\n Prima uma tecla para continuar\n'); pause

% sub-amostrar fazendo uma pre-filtragem FIR com um comprimento 31
fprintf('\n O som sub-amostrado \n')
x=decimate(y,k,30,'FIR');
sound(x,fs/k);
figure(2);
subplot(1,2,1),bar(x(2000/k:2060/k),0.02);axis tight;
title('Forma de onda do sinal sub-amostrado');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(x, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequencia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal sub-amostrado');

fprintf('\n Prima uma tecla para continuar\n'); pause;

%mostrar o pre-filtro utilizado
fprintf('\n O pre-filtro utilizado \n')
figure(3); hdec=fir1(30,1/k);[hdecspec,f]=freqz(hdec,1);
subplot(1,2,1),bar(-15:1:15,hdec,0.02);axis tight;title('Resposta Impulsional do pre-filtro ');
subplot(1,2,2),
plot(f/pi,20*log10(abs(hdecspec)));axis tight;title('Resposta em frequencia do pre-filtro');
ylabel('Magnitude');xlabel('Frequencia');

fprintf('\n Prima uma tecla para continuar\n'); pause;

%Interpolacao usando um filtro FIR pre-definido
% os coeficientes do filtro sao retornados em hintp
% o sinal amostrado e retornado no vector z
fprintf('\n O som interpolado \n')
[z,hintp]=interp(x,k);

%mostrar o sinal interpolado
sound(z,fs);
figure(4);
subplot(1,2,1),bar(z(2000:2060),0.02);axis tight;
title('Forma de Onda do sinal interpolado');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(z, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequencia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal interpolado');

%subplot(1,2,2),psd(z,256,fs);axis([0,fs/2,- 60,0]);ylabel('');xlabel('');
%title('Espectro do sinal interpolado');

fprintf('\n Prima uma tecla para continuar\n'); pause;

%mostrar o filtro utilizado na interpolacao (hintp)
fprintf('\n O filtro utilizado na interpolacao \n')
figure(5); [hintpspec,f]=freqz(hintp,1);
subplot(1,2,1),bar(-floor(length(hintp)/2):1:floor(length(hintp)/2),hintp,0.02);axis tight;
title('Reposta impulsional do filtro');
subplot(1,2,2),
plot(f/pi,20*log10(abs(hintpspec)));axis tight;
title('Resposta em frequencia do filtro');ylabel('Magnitude');xlabel('Frequencia');

fprintf('\n Prima uma tecla para continuar\n'); pause;

% Guardar o sinal interpolado 
audiowrite(ficheiroInterpolado,z,fs);

% Calcular o erro quadratico medio MSE e PSNR
% usa apenas as N amostras do sinal original, N multiplo de k 
crop=y(1:1:N);
D=crop-z;
MSE=mean(D.^2);
MSE2 = sum(sum((crop - z).^2))/N;
MAXy=max(crop);
PSNR = 10*log10((double(MAXy^2))/MSE2);
fprintf('\nErro entre o sinal original e o interpolado = %g\n\n',MSE);
fprintf('\nPSNR do sinal interpolado = %g\n\n',PSNR);