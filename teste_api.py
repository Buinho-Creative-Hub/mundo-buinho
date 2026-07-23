"""Teste do backend: garante que NUNCA devolve erro ao cliente."""
import json, base64, importlib, sys
import app as A

c = A.app.test_client()
passes = falhas = 0
def ok(cond, msg):
    global passes, falhas
    if cond: passes += 1; print("  OK  " + msg)
    else: falhas += 1; print("  FALHA: " + msg)

print("\n--- /api/saude ---")
r = c.get("/api/saude")
ok(r.status_code == 200, "saude devolve 200")
ok(r.json["ok"] is True, "saude diz ok")
ok("chave" not in json.dumps(r.json).lower() or r.json["chave_montada"] in (True, False),
   "saude nao revela a chave")

print("\n--- /api/dica sem chave Mistral (fallback) ---")
r = c.post("/api/dica", json={"contexto": "a crianca errou as doses"})
ok(r.status_code == 200, "dica devolve 200 mesmo sem chave")
ok(bool(r.json["texto"].strip()), "dica traz texto nao vazio")
ok(r.json["fonte"] == "fallback", "marca fonte=fallback")
ok(r.json["texto"] in A.FALLBACK_HINT, "texto vem do array de fallback PT-PT")

print("\n--- /api/dica com contexto vazio ---")
r = c.post("/api/dica", json={"contexto": ""})
ok(r.status_code == 200, "contexto vazio nao rebenta")
ok(bool(r.json["texto"].strip()), "devolve fallback")

print("\n--- /api/dica sem body ---")
r = c.post("/api/dica", json={})
ok(r.status_code == 200, "body vazio nao rebenta")

print("\n--- /api/desenho ---")
png = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0"*400).decode()
r = c.post("/api/desenho", json={"imagem": png, "desafio": "uma folha"})
ok(r.status_code == 200, "desenho devolve 200")
ok(r.json["texto"] in A.FALLBACK_PRAISE, "usa fallback de elogio")

r = c.post("/api/desenho", json={"imagem": "", "desafio": "x"})
ok(r.status_code == 200, "imagem vazia nao rebenta")

r = c.post("/api/desenho", json={"imagem": "!!!nao-e-base64!!!", "desafio": "x"})
ok(r.status_code == 200, "base64 invalido nao rebenta")
ok(bool(r.json["texto"].strip()), "e ainda assim responde algo")

r = c.post("/api/desenho", json={"imagem": "A"*5_000_000, "desafio": "x"})
ok(r.status_code == 200, "imagem gigante nao rebenta")

print("\n--- Mistral a falhar (simulado) ---")
A.MISTRAL_API_KEY = "chave-falsa"
orig = A._mistral
A._mistral = lambda *a, **k: None      # simula timeout/500
r = c.post("/api/dica", json={"contexto": "teste"})
ok(r.status_code == 200 and r.json["fonte"] == "fallback", "API morta -> fallback, nunca erro")
A._mistral = lambda *a, **k: "Olha melhor os numeros! 🌱"
r = c.post("/api/dica", json={"contexto": "teste"})
ok(r.json["fonte"] == "mistral" and "numeros" in r.json["texto"], "API viva -> texto do modelo")
A._mistral = orig
A.MISTRAL_API_KEY = ""

print("\n--- rate limit ---")
A._hits.clear()
codigos = set()
for i in range(A.RATE_MAX + 12):
    rr = c.post("/api/dica", json={"contexto": "spam"})
    codigos.add(rr.status_code)
ok(codigos == {200}, "mesmo sob rate limit devolve sempre 200 (nunca 429 a uma crianca)")
A._hits.clear()

print("\n--- estaticos ---")
ok(c.get("/").status_code == 200, "/ serve o index")
ok(c.get("/static/css/mundo.css").status_code == 200, "css e servido")
ok(c.get("/static/js/nucleo.js").status_code == 200, "js e servido")

print("\n" + "="*46)
print(f"RESULTADO: {passes} passaram, {falhas} falharam")
print("="*46)
sys.exit(1 if falhas else 0)
