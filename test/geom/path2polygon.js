import {test} from "zora";
import {default as path2polygon} from "../../src/geom/path2polygon";

test("geom/path2polygon", assert => {

  const path = "M2.4492935982947064e-14,-400A400,400,0,0,1,380.4226065180614,-123.60679774997895L0,0Z",
        result = "M2.4492935982947064e-14,-400 L19.991667708271542,-399.50010415798647 L39.9333666587314,-398.0016661112103 L59.77525298943975,-395.5084311744169 L79.46773231802449,-392.02663113649663 L98.9615837018091,-387.56496868425796 L118.20808266453604,-382.1345956502424 L137.15912298218035,-375.74908513895167 L155.76733692346025,-368.424397601154 L173.98621364449207,-360.17884094107075 L191.77021544168113,-351.0330247561491 L209.07489157226388,-341.0098088238022 L225.85698935801423,-330.13424596387125 L242.07456229441587,-318.4335194196223 L257.6870748950764,-305.93687491379535 L272.6555040093336,-292.6755475495284 L286.9424363598092,-278.68268373886605 L300.5121620561172,-263.99325835399276 L313.33076385099343,-248.6439873082657 L325.3662019157495,-232.6732357855534 L336.58839392315855,-216.12092234725594 L346.96929023760686,-199.0284191566906 L356.48294402457424,-181.43844857023083 L365.10557610420847,-163.39497635366286 L372.8156343868906,-144.9431017906691 L379.5938477422346,-126.1289449581072 L380.4226065180614,-123.60679774997895 L0,0Z";

  assert.equal(result, `M${path2polygon(path).map(p => p.join(",")).join(" L")}Z`, "path to polygon");

});

export default test;
