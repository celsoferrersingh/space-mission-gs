package br.com.fiap.spacemission.controller;

import br.com.fiap.spacemission.model.Sensor;
import br.com.fiap.spacemission.service.SensorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensores")
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping
    public ResponseEntity<List<Sensor>> listar(
            @RequestParam(required = false) Sensor.StatusSensor status,
            @RequestParam(required = false) String modulo) {

        if (status != null) {
            return ResponseEntity.ok(sensorService.buscarPorStatus(status));
        }
        if (modulo != null) {
            return ResponseEntity.ok(sensorService.buscarPorModulo(modulo));
        }
        return ResponseEntity.ok(sensorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sensor> buscarPorId(@PathVariable Long id) {
        return sensorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sensor> criar(@Valid @RequestBody Sensor sensor) {
        Sensor salvo = sensorService.salvar(sensor);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sensor> atualizar(@PathVariable Long id, @Valid @RequestBody Sensor sensor) {
        return sensorService.atualizar(id, sensor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (sensorService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
