import Header from "../components/Header";

function Notification() {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Header />

      <main
        className="
          max-w-3xl
          mx-auto
          px-6
          py-10
        "
      >
        <section
          className="
            bg-white
            rounded-xl
            shadow-sm
            p-8
          "
        >
          <h1
            className="
              text-2xl
              font-bold
              text-blue-700
            "
          >
            알림
          </h1>

          <p
            className="
              mt-6
              text-gray-500
            "
          >
            아직 받은 알림이 없습니다.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Notification;
