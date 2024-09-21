import PropTypes from "prop-types";

const InfoPais = ({ data }) => {
  return (
    <div className="flex items-center justify-between gap-2 text-sm md:text-base w-full max-w-md">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-blue-600 min-w-[60px]">{data.name}</h2>
        <img
          src={data.flag}
          alt={`Bandera de ${data.name}`}
          className="w-6 h-4 md:w-8 md:h-6"
        />
      </div>
      <span className="font-semibold text-gray-700 min-w-[40px]">
        <span className="text-gray-700 mr-2">{data.currency}</span>
        <span className="text-gray-700">{data.usd_price}</span>
      </span>
    </div>
  );
};

InfoPais.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    usd_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

export default InfoPais;
