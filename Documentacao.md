# Regras Negócio

1. O primeiro caractere é "{" ou "["
2. O ultimo caractere é "}" ou "]"
3. Pode ter Sub JSON's ou Sub Array
4. Pode ser um array de json's
5. Pode ser um JSON
6. Caso o valor for "{" ou "[" deve iniciar um novo escopo
7. Caso o valor for uma string pode conter espaços
8. A chave pode conter espaços ou caracter especiais
9. O ultimo elemento nunca tem virgula
10. Todas as linhas no final tem virgula, exceto:
    - Ultimo elemento do array ou JSON
    - Caso o valor de uma linha for a abertura de uma chave "{" ou "["

# Considerações

- O arquivo pode estar com quebras de linha ou na mesma linha.

# Ideias

### Leitura do arquivo

Irei utilizar o File Reader uma api do navegador, irei utilizar o método readAsArrayBuffer onde ele transforma os caracteres em um array buffer.

### Lazy Loading
Irei utilizar a técnica de lazy loading, é renderizar uma área que usuário vê, por isso limitei a visualização inicialmente, vai criar scrollbar vertical e horizontal e conforme ele for fazendo scroll irei renderizando.

### Irei separar em 2 partes:

1. Interpretador
2. Renderização HTML

### Interpretador
Tem a função de entender o que é aquele caractere e retornar se deve ser renderizado ou não.

Caso deve ser renderizado deve retornar qual token é.

### Renderização HTML
Tem a função de entender o token retornado pelo interpretador e renderizar de acordo com o que foi retornado.

**Tokens:**
- Chave de abertura
- Chave
- Valor
- Chave de fechamento

# Testes
- Montar uma árvore virtual onde vai montando todos os elementos e renderiza no final quando terminar.
- Ir renderizando conforme for passando por cada caractere.
- Ler de 1000 bytes em 1000 bytes (verificar se é possível ler mais em cada vez)

# To-do
- Fazer interpretador
- Fazer renderização HTML
- Fazer lazy loading
- Fazer validação
- Testar perfomance

# Perguntas

### Por que utilizar o Array Buffer

É por que ele separa em partes em um array que é possível ler aos poucos.

### Por que não utilizar JSON.parse?
Tentei utilizar ele porém para arquivos grandes ele é ineficiente já que ele passa por todo o JSON, dessa forma eu não consigo ir lendo em partes e ir renderizando.

# JSON Tree HTML

### Caso for uma chave sozinha ("{" ou "[" ou "}" ou "]") CHAVE_ABERTURA:
```html
<div class="rf-row">
    <div class="rf-bracket"></div>
</div>
```

### Caso for chave CHAVE:
```html
<div class="rf-row">
    <div class="rf-key"></div>
</div>
```

### Caso for valor VALOR:
```html
<div class="rf-value"></div>
```

### Subniveis
```html
<div class="rf-content"></div>
```

### Escopo
Cada subnivel o conteudo deve estar dentro
```html
<div class="rf-content"></div>
```

### Row:
Mostra em uma linha os elementos dentro (display: flex)

Todos elementos devem estar dentro dele
```html
<div class="rf-row"></div>
```

### Toda o JSON Tree vai estar dentro
Vai conter scroll
```html
<div class="rf-scope"></div>
```

## Exemplos

### JSON Básico
```
Inicio
    "Chave": Valor
Final
```

```html
<div class="rf-scope">
    <div class="rf-row">
        <div class="rf-bracket">{</div>
    </div>
    <div class="rf-content">
        <div class="rf-row">
            <div class="rf-key">"Chave:"</div>
            <div class="rf-value">Valor</div>
        </div>
    </div>
    <div class="rf-row">
        <div class="rf-bracket">}</div>
    </div>
</div>
```

### JSON Subniveis
```
Inicio
    "Chave1": {
        "Chave2": Valor1,
        "Chave3": Valor2
    },
	"Chave2": [
		"Valor 1",
		"Valor 2"
	]
Final
```

```html
<div class="rf-scope">
	<div class="rf-row">
		<div class="rf-bracket">{</div>
	</div>
	<div class="rf-content">
		<div class="rf-row">
			<div class="rf-key">"Chave1:"</div>
			<div class="rf-bracket">{</div>
		</div>
		<div class="rf-content">
			<div class="rf-row">
				<div class="rf-key">"Chave2:"</div>
				<div class="rf-value">Valor1,</div>
			</div>
			<div class="rf-row">
				<div class="rf-key">"Chave3:"</div>
				<div class="rf-value">Valor2</div>
			</div>
		</div>
		<div class="rf-bracket">},</div>
		<div class="rf-row">
			<div class="rf-key">"Chave2:"</div>
			<div class="rf-bracket">[</div>
		</div>
		<div class="rf-content">
			<div class="rf-row">
				<div class="rf-value">Valor1,</div>
			</div>
			<div class="rf-row">
				<div class="rf-value">Valor2</div>
			</div>
		</div>
		<div class="rf-bracket">],</div>
	</div>
	<div class="rf-row">
		<div class="rf-bracket">}</div>
	</div>
</div>
```

### Array de JSON's
```
Inicio Array
	Inicio JSON
		"Chave1": {
			"Chave2": Valor1,
			"Chave3": Valor2
		}
	Final JSON
Final Array
```

```html
<div class="rf-scope">
	<div class="rf-row">
		<div class="rf-bracket">[</div>
	</div>
	<div class="rf-content">
		<div class="rf-row">
			<div class="rf-bracket">{</div>
		</div>
		<div class="rf-content">
			<div class="rf-row">
				<div class="rf-key">"Chave1:"</div>
				<div class="rf-bracket">{</div>
			</div>
			<div class="rf-content">
				<div class="rf-row">
					<div class="rf-key">"Chave2:"</div>
					<div class="rf-value">Valor1,</div>
				</div>
				<div class="rf-row">
					<div class="rf-key">"Chave3:"</div>
					<div class="rf-value">Valor2</div>
				</div>
			</div>
			<div class="rf-bracket">}</div>
		</div>
		<div class="rf-row">
			<div class="rf-bracket">}</div>
		</div>
	</div>
	<div class="rf-row">
		<div class="rf-bracket">]</div>
	</div>
</div>
```

### Subnivel JSON
```
Inicio JSON
	"Chave1": {
		"Chave2": {
			"Chave": Valor,
		},
	}
Final JSON
```

```html
<div class="rf-scope">
	<div class="rf-row">
		<div class="rf-bracket">{</div>
	</div>
	<div class="rf-content">
		<div class="rf-row">
			<div class="rf-key">"Chave1:"</div>
			<div class="rf-bracket">{</div>
		</div>
		<div class="rf-content">
			<div class="rf-row">
				<div class="rf-key">"Chave2"</div>
				<div class="rf-bracket">{</div>
			</div>
			<div class="rf-content">
				<div class="rf-row">
					<div class="rf-key">"Chave2:"</div>
					<div class="rf-value">Valor</div>
				</div>
			</div>
			<div class="rf-row">
				<div class="rf-bracket">}</div>
			</div>
		</div>
		<div class="rf-row">
			<div class="rf-bracket">}</div>
		</div>
	</div>
	<div class="rf-row">
		<div class="rf-bracket">}</div>
	</div>
</div>
```
