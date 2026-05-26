package br.com.fiap.spacemission.service;

import br.com.fiap.spacemission.model.Sensor;
import br.com.fiap.spacemission.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SensorService {

    private final SensorRepository sensorRepository;

    public SensorService(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    public List<Sensor> listarTodos() {
        return sensorRepository.findAll();
    }

    public Optional<Sensor> buscarPorId(Long id) {
        return sensorRepository.findById(id);
    }

    public List<Sensor> buscarPorStatus(Sensor.StatusSensor status) {
        return sensorRepository.findByStatus(status);
    }

    public List<Sensor> buscarPorModulo(String modulo) {
        return sensorRepository.findByModulo(modulo);
    }

    public Sensor salvar(Sensor sensor) {
        return sensorRepository.save(sensor);
    }

    public Optional<Sensor> atualizar(Long id, Sensor sensorAtualizado) {
        return sensorRepository.findById(id).map(sensor -> {
            sensor.setNome(sensorAtualizado.getNome());
            sensor.setTipo(sensorAtualizado.getTipo());
            sensor.setModulo(sensorAtualizado.getModulo());
            sensor.setStatus(sensorAtualizado.getStatus());
            sensor.setUltimaLeitura(sensorAtualizado.getUltimaLeitura());
            sensor.setUnidade(sensorAtualizado.getUnidade());
            sensor.setLocalizacao(sensorAtualizado.getLocalizacao());
            return sensorRepository.save(sensor);
        });
    }

    public boolean deletar(Long id) {
        if (sensorRepository.existsById(id)) {
            sensorRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
