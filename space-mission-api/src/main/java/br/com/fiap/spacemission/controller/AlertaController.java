package br.com.fiap.spacemission.controller;

import br.com.fiap.spacemission.model.Alerta;
import br.com.fiap.spacemission.service.AlertaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    @GetMapping
    public ResponseEntity<List<Alerta>> listar(
            @RequestParam(required = false) Alerta.NivelAlerta nivel,
            @RequestParam(required = false) String sistema,
            @RequestParam(required = false) Boolean resolvido) {

        if (nivel != null) {
            return ResponseEntity.ok(alertaService.buscarPorNivel(nivel));
        }
        if (sistema != null) {
            return ResponseEntity.ok(alertaService.buscarPorSistema(sistema));
        }
        if (Boolean.FALSE.equals(resolvido)) {
            return ResponseEntity.ok(alertaService.buscarNaoResolvidos());
        }
        return ResponseEntity.ok(alertaService.listarTodos());
    }

    @GetMapping("/nao-resolvidos")
    public ResponseEntity<List<Alerta>> listarNaoResolvidos() {
        return ResponseEntity.ok(alertaService.buscarNaoResolvidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable Long id) {
        return alertaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Alerta> criar(@Valid @RequestBody Alerta alerta) {
        Alerta salvo = alertaService.salvar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PatchMapping("/{id}/resolver")
    public ResponseEntity<Alerta> resolver(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String resolucao = body.getOrDefault("resolucao", "Resolvido pelo operador");
        return alertaService.resolver(id, resolucao)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (alertaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
