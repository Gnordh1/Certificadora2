package com.circuitlearn.repository;



import com.circuitlearn.model.Exercicio;
import com.circuitlearn.model.RespostaUsuario;
import com.circuitlearn.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RespostaUsuarioRepository extends JpaRepository<RespostaUsuario, Long> {
    List<RespostaUsuario> findByUsuario(Usuario usuario);
    List<RespostaUsuario> findByUsuarioAndExercicio(Usuario usuario, Exercicio exercicio);
}
