package br.com.fiap.spacemission.controller;

import br.com.fiap.spacemission.model.EventoOperacional;
import br.com.fiap.spacemission.service.EventoOperacionalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoOperacionalController {

    private final EventoOperacionalService eventoService;

    public EventoOperacionalController(EventoOperacionalService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public ResponseEntity<List<EventoOperacional>> listar(
            @RequestParam(required = false) EventoOperacional.TipoEvento tipo,
            @RequestParam(required = false) String sistema,
            @RequestParam(required = false) String faseMissao) {

        if (tipo != null) {
            return ResponseEntity.ok(eventoService.buscarPorTipo(tipo));
        }
        if (sistema != null) {
            return ResponseEntity.ok(eventoService.buscarPorSistema(sistema));
        }
        if (faseMissao != null) {
            return ResponseEntity.ok(eventoService.buscarPorFaseMissao(faseMissao));
        }
        return ResponseEntity.ok(eventoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoOperacional> buscarPorId(@PathVariable Long id) {
        return eventoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventoOperacional> criar(@Valid @RequestBody EventoOperacional evento) {
        EventoOperacional salvo = eventoService.salvar(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (eventoService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
