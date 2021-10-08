package com.example

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.example.plugins.*
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

import io.ktor.server.engine.*
import io.ktor.server.netty.*




fun main() {
    val server = embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
        routing {
           get("/") {
            call.respondText(
                this::class.java.classLoader.getResource("index.html")!!.readText(),
                ContentType.Text.Html
            )
        }
        static("/") {
            resources("")
        }
            get("/demo") {
                call.respondText("HELLO, WORLD!")
            }
        }
    }
    server.start(wait = true)
}