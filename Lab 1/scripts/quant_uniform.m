% Este programa faz a quantiza??o de um sinal audio n?o comprimido.
% Recebe como parametros os nomes dos ficheiros de entrada e saida e o numerado e niveis de quantizacao
% Programa adaptado da fun??o ?quant_uniform.m de Yao Wang, Polytechnic University, 2/11/2004

function []=quant_uniform(ficheiroEntrada,ficheiroSaida, N) 

if nargin < 3
disp('Utilizacao: quant_uniform(nome_ficheiro_entrada, nome_ficheiro_saida, numero de nivei');
disp('ficheiroEntrada: nome de um ficheiro wave');
disp('ficheiroSaida: nome de um ficheiro wave para escreve o som resultante'); 
disp('N: inteiro com numero de knives de quantizacao');
end;

%importar um ficheiro de som (representado com 16 bits) e calcular passo de quantiza??o
[x,fs]=audioread(ficheiroEntrada);
magmax=max(abs(x)); 
xmin=-magmax, xmax=magmax;
Q=(xmax-xmin)/N; 
disp('xmin,xmax,N,Q'); 
disp([xmin,xmax,N,Q]);

%aplicar quantizacao uniforme a cada amostra do sinal de entrada e gravar
xq=floor((x-xmin)/Q)*Q+Q/2+xmin;
audiowrite(ficheiroSaida,xq,fs); 

%comparar qualidade do som original  quantizado
sound(x,fs);
fprintf('\n Prima uma tecla para continuar');
pause;
sound(xq,fs);

%plot das formas de onda ao longo de todo o periodo
t=1:length(x);
figure; plot(t,x,'r:');
hold on; plot(t,xq,'b-');
axis tight; grid on; legend('original','quantizado')

%plot da forma de onda num periodo t=2000:2200;
t=2000:2200;
figure; plot(t,x(2000:2200),'r:'); hold on; plot(t,xq(2000:2200),'b-'); axis tight; grid on;

% calcular o MSE e PSNR
D=x-xq;
MSE=mean(D.^2);
MSE2 = sum(sum((x - xq).^2))/N;
MAXx=max(x);
PSNR = 10*log10((double(MAXx^2))/MSE2);
fprintf('\nErro entre o sinal original e o interpolado = %g\n\n',MSE);
fprintf('\nPSNR do sinal interpolado = %g\n\n',PSNR);