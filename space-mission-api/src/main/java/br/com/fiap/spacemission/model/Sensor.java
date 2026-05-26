package br.com.fiap.spacemission.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_sensor")
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do sensor é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O tipo do sensor é obrigatório")
    @Column(nullable = false, length = 80)
    private String tipo;

    @NotBlank(message = "O módulo é obrigatório")
    @Column(nullable = false, length = 100)
    private String modulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSensor status = StatusSensor.ATIVO;

    @Column(name = "ultima_leitura")
    private Double ultimaLeitura;

    @Column(length = 20)
    private String unidade;

    @Column(name = "localizacao", length = 150)
    private String localizacao;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public Sensor() {}

    public Sensor(Long id, String nome, String tipo, String modulo, StatusSensor status,
                  Double ultimaLeitura, String unidade, String localizacao,
                  LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.modulo = modulo;
        this.status = status;
        this.ultimaLeitura = ultimaLeitura;
        this.unidade = unidade;
        this.localizacao = localizacao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getTipo() { return tipo; }
    public String getModulo() { return modulo; }
    public StatusSensor getStatus() { return status; }
    public Double getUltimaLeitura() { return ultimaLeitura; }
    public String getUnidade() { return unidade; }
    public String getLocalizacao() { return localizacao; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setModulo(String modulo) { this.modulo = modulo; }
    public void setStatus(StatusSensor status) { this.status = status; }
    public void setUltimaLeitura(Double ultimaLeitura) { this.ultimaLeitura = ultimaLeitura; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }

    public enum StatusSensor {
        ATIVO, INATIVO, FALHA, MANUTENCAO
    }
}
