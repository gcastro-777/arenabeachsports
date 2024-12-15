document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservation-form");
    const tableBody = document.querySelector("#reservations-table tbody");
    let reservations = [];
    let idCounter = 1;

    // Adiciona nova reserva
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const quadra = document.getElementById("quadra").value;
        const data = document.getElementById("data").value;
        const horaInicio = document.getElementById("hora-inicio").value;
        const horaFim = document.getElementById("hora-fim").value;
        const telefone = document.getElementById("telefone").value;
        const observacao = document.getElementById("observacao").value;

        // Verifica conflitos
        if (reservations.some(reserva =>
            reserva.quadra === quadra &&
            reserva.data === data &&
            ((horaInicio >= reserva.horaInicio && horaInicio < reserva.horaFim) ||
             (horaFim > reserva.horaInicio && horaFim <= reserva.horaFim)))) {
            alert("Conflito de horário na quadra selecionada!");
            return;
        }

        // Adiciona nova reserva
        const reservation = {
            id: String(idCounter++).padStart(4, "0"),
            quadra,
            data,
            horaInicio,
            horaFim,
            telefone,
            observacao
        };
        reservations.push(reservation);
        updateTable();
        form.reset();
    });

    // Atualiza a tabela
    function updateTable() {
        tableBody.innerHTML = "";
        const now = new Date();

        reservations = reservations.filter(reserva => {
            const reservaDate = new Date(`${reserva.data}T${reserva.horaFim}`);
            return reservaDate >= now;
        });

        reservations.forEach(reserva => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.quadra}</td>
                <td>${reserva.data}</td>
                <td>${reserva.horaInicio} às ${reserva.horaFim}</td>
                <td>${reserva.telefone}</td>
                <td>${reserva.observacao}</td>
                <td><button onclick="deleteReservation('${reserva.id}')">Excluir</button></td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Exclui uma reserva
    window.deleteReservation = function (id) {
        reservations = reservations.filter(reserva => reserva.id !== id);
        updateTable();
    };
});
