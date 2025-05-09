package com.circuitlearn.repository;


import com.circuitlearn.model.Exercicio;
import com.circuitlearn.model.NivelDificuldade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    @Override
    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findAll(Pageable pageable);

    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByCategoria(String categoria, Pageable pageable);

    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByDificuldade(NivelDificuldade dificuldade, Pageable pageable);

    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByCategoriaAndDificuldade(String categoria, NivelDificuldade dificuldade, Pageable pageable);

    // --- NOVOS MÉTODOS PARA FILTRAR POR USUÁRIO ---

    // Busca todos os exercícios, excluindo os respondidos corretamente pelo usuário
    @Query("SELECT e FROM Exercicio e WHERE e.id NOT IN " +
            "(SELECT ru.exercicio.id FROM RespostaUsuario ru WHERE ru.usuario.id = :usuarioId AND ru.correta = true)")
    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findAllNotAnsweredCorrectlyByUser(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Busca por categoria, excluindo os respondidos corretamente pelo usuário
    @Query("SELECT e FROM Exercicio e WHERE e.categoria = :categoria AND e.id NOT IN " +
            "(SELECT ru.exercicio.id FROM RespostaUsuario ru WHERE ru.usuario.id = :usuarioId AND ru.correta = true)")
    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByCategoriaNotAnsweredCorrectlyByUser(@Param("categoria") String categoria, @Param("usuarioId") Long usuarioId, Pageable pageable);

    // Busca por dificuldade, excluindo os respondidos corretamente pelo usuário
    @Query("SELECT e FROM Exercicio e WHERE e.dificuldade = :dificuldade AND e.id NOT IN " +
            "(SELECT ru.exercicio.id FROM RespostaUsuario ru WHERE ru.usuario.id = :usuarioId AND ru.correta = true)")
    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByDificuldadeNotAnsweredCorrectlyByUser(@Param("dificuldade") NivelDificuldade dificuldade, @Param("usuarioId") Long usuarioId, Pageable pageable);

    // Busca por categoria E dificuldade, excluindo os respondidos corretamente pelo usuário
    @Query("SELECT e FROM Exercicio e WHERE e.categoria = :categoria AND e.dificuldade = :dificuldade AND e.id NOT IN " +
            "(SELECT ru.exercicio.id FROM RespostaUsuario ru WHERE ru.usuario.id = :usuarioId AND ru.correta = true)")
    @EntityGraph(value = "Exercicio.withAlternativas", type = EntityGraph.EntityGraphType.LOAD)
    Page<Exercicio> findByCategoriaAndDificuldadeNotAnsweredCorrectlyByUser(@Param("categoria") String categoria, @Param("dificuldade") NivelDificuldade dificuldade, @Param("usuarioId") Long usuarioId, Pageable pageable);
}