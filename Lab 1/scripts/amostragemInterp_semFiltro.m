% Esta fun??o faz a sub-amostragem de um ficheiro de audio n?o comprimido
%por um factor k e a sua interpola??o pelo mesmo factor para repor o
%n?mero de amostras. A interpola??o ? feita pela repeti??o de cada amostra k vezes.
% N?o utiliza pr?-filtragem.
% Baseado em down4up4_nofilt de Yao Wang, Polytechnic University, 1/11/2004

function[]=amostragemIntero_semFiltro(ficheiroOriginal,ficheiroInterpolado,k)

fprintf('\n Importar o som original\n');
[y,fs]=audioread(ficheiroOriginal);

% tornar a sequencia multipla de k
orig_length=length(y);
N=floor(orig_length/k)*k;
N=floor(orig_length/k)*k;
N=floor(orig_length/k)*k;

% tocar a musica original e mostrar a sua forma de onda
sound(y,fs);
figure(1);
subplot(1,2,1), bar(y(2000:2060),0.02);
axis tight;
title('forma de onda original');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(y, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequ?ncia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal de entrada');

fprintf('\n Carregue numa tecla para continuar\n');
pause

% sub-amostragem sem filtro: reter uma em cada k amostras
fprintf('\n O som sub-amostrado\n');
x=y(1:k:N);
%reproduzir e mostrar o som sub-amostrado
sound(x,fs/k);
figure(2);
subplot(1,2,1),bar(x(2000/k:2060/k),0.02);
axis tight;
title('forma de onda sub-amostrada');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(x, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequ?ncia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal sub-amostrado');

fprintf('\n Carregue numa tecla para continuar\n');
pause

%interpolacao para repor numero de amostras (repete k vezes cada amostra)
fprintf('\n O som interpolado\n');
z=zeros(N,1);
%copia cada amostra de x para z k vezes cada
for(i=0:1:k-1)
    z(1+i:k:N)=x;
end

%toca e mostra o som interpolado
sound(z,fs);
figure(3);
subplot(1,2,1),bar(z(2000/k:2060/k),0.02);
axis tight;
title('forma de onda interpolada');
%mostrar o espectro
npfft=2048;
T=1/fs;
t=[0:T:0.04-T]; % 40 milissegundos de sinal
[H, W] = freqz(z, 1.0, npfft, fs); 
subplot(1,2,2), plot(W, abs(H));
xlabel('Frequ?ncia (Hz)');
ylabel('Magnitude');
title('Espectro do sinal interpoladoo');

fprintf('\n Carregue numa tecla para continuar\n');
pause

%guarda sinal interpolado
audiowrite(ficheiroInterpolado,z,fs);

% Calcular o erro quadratico medio MSE e PSNR (Peak Signal to Noise Ratio)
% usa apenas as N amostras do sinal original, N multiplo de k
crop=y(1:1:N);
D=crop-z;
MSE=mean(D.^2);
MSE2 = sum(sum((crop - z).^2))/N;
MAXy=max(y);
PSNR = 10*log10((double(MAXy^2))/MSE2);
fprintf('\nErro entre o sinal original e o interpolado = %g\n\n',MSE);
fprintf('\nPSNR do sinal interpolado = %g\n\n',PSNR);

