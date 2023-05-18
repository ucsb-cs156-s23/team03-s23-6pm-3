package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Song;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.SongRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Api(description = "Song")
@RequestMapping("/api/song")
@RestController
@Slf4j
public class SongController extends ApiController {

    @Autowired
    SongRepository songRepository;

    @ApiOperation(value = "List all songs")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Song> allSong() {
        Iterable<Song> dates = songRepository.findAll();
        return dates;
    }

    @ApiOperation(value = "Get a single song")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Song getById(
            @ApiParam("id") @RequestParam Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Song.class, id));

        return song;
    }

    @ApiOperation(value = "Create a new song")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Song postSong(
            @ApiParam("title") @RequestParam String title,
            @ApiParam("artist") @RequestParam String artist,
            @ApiParam("album") @RequestParam String album,
            )
            throws JsonProcessingException {

        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setAlbum(album);

        Song savedSong = songRepository.save(song);

        return savedSong;
    }

    @ApiOperation(value = "Delete a Song")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteSong(
            @ApiParam("id") @RequestParam Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Song.class, id));

        songRepository.delete(song);
        return genericMessage("Song with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single song")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Song updateSong(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Song incoming) {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Song.class, id));

        song.setTitle(incoming.getTitle());
        song.setArtist(incoming.getArtist());
        song.setAlbum(incoming.getAlbum());

        songRepository.save(song);

        return song;
    }
}
